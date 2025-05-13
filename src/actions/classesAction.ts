"use server";
import { db } from "@/db/drizzle";
import { classes, students } from "../db/schema";
import { eq, count } from "drizzle-orm";

export async function addStudent(data: {
  name: string;
  phone: string;
  class_id: number;
}) {
  const studentCount = await db
    .select({ count: count() })
    .from(students)
    .where(eq(students.class_id, data.class_id));

  const classData = await db
    .select({ max_students: classes.max_students })
    .from(classes)
    .where(eq(classes.id, data.class_id))
    .limit(1);

  if (studentCount[0].count >= classData[0].max_students) {
    throw new Error("Class is already full.");
  }

  await db.insert(students).values({
    name: data.name,
    phone: data.phone,
    class_id: data.class_id,
  });

  if (studentCount[0].count + 1 >= classData[0].max_students) {
    await db
      .update(classes)
      .set({ is_full: true })
      .where(eq(classes.id, data.class_id));
  }
}

export async function removeStudent(studentId: number) {
  const student = await db
    .select({ class_id: students.class_id })
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);

  if (!student.length) {
    throw new Error("Student not found.");
  }

  const classId = student[0].class_id;

  await db.delete(students).where(eq(students.id, studentId));

  const studentCount = await db
    .select({ count: count() })
    .from(students)
    .where(eq(students.class_id, classId));

  const classData = await db
    .select({ max_students: classes.max_students })
    .from(classes)
    .where(eq(classes.id, classId))
    .limit(1);

  if (studentCount[0].count < classData[0].max_students) {
    await db
      .update(classes)
      .set({ is_full: false })
      .where(eq(classes.id, classId));
  }
}

export async function getClasses() {
  const classesWithStudentCount = await db
    .select({
      id: classes.id,
      max_students: classes.max_students,
      professor: classes.professor,
      modality: classes.modality,
      weekday: classes.weekday,
      start_time: classes.start_time,
      duration: classes.duration,
      is_full: classes.is_full,
      enrolled_students: count(students.id).as("enrolled_students"),
    })
    .from(classes)
    .leftJoin(students, eq(classes.id, students.class_id))
    .groupBy(classes.id);

  return classesWithStudentCount;
}

export async function getEnrolledStudents(classId: number) {
  return await db
    .select({
      id: students.id,
      name: students.name,
      phone: students.phone,
    })
    .from(students)
    .where(eq(students.class_id, classId));
}
