"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  getClasses,
  addStudent,
  getEnrolledStudents,
  removeStudent,
} from "@/actions/classesAction";

type Class = Awaited<ReturnType<typeof getClasses>>[number];
type Student = Awaited<ReturnType<typeof getEnrolledStudents>>[number];

const weekdays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

const weekdayNames: Record<(typeof weekdays)[number], string> = {
  sunday: "Domingo",
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
};

const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export default function Home() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");

  useEffect(() => {
    async function fetchClasses() {
      const fetchedClasses = await getClasses();
      setClasses(fetchedClasses);
    }
    fetchClasses();
  }, []);

  const handleSelectClass = async (cls: Class) => {
    setSelectedClass(cls);
    const students = await getEnrolledStudents(cls.id);
    setEnrolledStudents(students);
  };

  const handleEnroll = async () => {
    if (!selectedClass) return;

    try {
      await addStudent({
        name: studentName,
        phone: studentPhone,
        class_id: selectedClass.id,
      });
      alert("Aluno cadastrado com sucesso!");
      setStudentName("");
      setStudentPhone("");

      // Refresh enrolled students and class list
      const updatedStudents = await getEnrolledStudents(selectedClass.id);
      setEnrolledStudents(updatedStudents);

      const updatedClasses = await getClasses();
      setClasses(updatedClasses);
    } catch {
      alert("Falha ao cadastrar aluno");
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!selectedClass) return;

    try {
      await removeStudent(studentId);
      alert("Aluno removido com sucesso!");

      // Refresh enrolled students and class list
      const updatedStudents = await getEnrolledStudents(selectedClass.id);
      setEnrolledStudents(updatedStudents);

      const updatedClasses = await getClasses();
      setClasses(updatedClasses);
    } catch {
      alert("Falha ao remover aluno");
    }
  };

  const handlePhoneInput = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    setStudentPhone(cleaned);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">AgendaGym</h1>
      <div className="grid grid-cols-7 gap-4">
        {weekdays.map((day) => (
          <div key={day} className="border p-2 rounded">
            <h2 className="font-semibold capitalize mb-2">
              {weekdayNames[day]}
            </h2>
            <div className="space-y-2">
              {classes
                .filter((cls) => cls.weekday === day)
                .sort((a, b) => a.start_time.localeCompare(b.start_time))
                .map((cls) => (
                  <div
                    key={cls.id}
                    className="border p-2 rounded shadow cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelectClass(cls)}
                  >
                    <p>
                      <strong>{cls.modality}</strong>
                      {" - "}
                      {cls.start_time.slice(0, 5)}
                    </p>
                    <p className="text-sm text-right">
                      {cls.enrolled_students}/{cls.max_students}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {selectedClass && (
        <Dialog
          open={!!selectedClass}
          onOpenChange={() => setSelectedClass(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedClass.modality}</DialogTitle>
            </DialogHeader>
            <div className="w-full flex gap-3">
              <div className="w-1/2 h-full">
                <p>
                  <strong>Professor:</strong> {selectedClass.professor}
                </p>
                <p>
                  <strong>Horário:</strong>{" "}
                  {selectedClass.start_time.slice(0, 5)}
                </p>
                <p>
                  <strong>Duração:</strong> {selectedClass.duration} minutos
                </p>
                <p>
                  <strong>Capacidade:</strong> {selectedClass.max_students}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedClass.is_full ? "Cheia" : "Disponível"}
                </p>
              </div>

              <div className="w-1/2 h-full">
                <h3 className="font-semibold mb-2">Alunos</h3>
                <ul className="space-y-2">
                  {enrolledStudents.map((student) => (
                    <li
                      key={student.id}
                      className="flex justify-between items-center border p-2 rounded"
                    >
                      <span>
                        <strong>{student.name}</strong> (
                        {formatPhone(student.phone)})
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveStudent(student.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18M4 6l1 16h14l1-16M10 6V4a2 2 0 0 1 4 0v2m-4 0h4m-4 0v12m0-12H8m4 0h4m-4 0v12m0-12H8m4 0v12" />
                        </svg>
                      </Button>
                    </li>
                  ))}
                </ul>
                {enrolledStudents.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    Nenhum aluno cadastrado
                  </p>
                )}
              </div>
            </div>

            {!selectedClass.is_full && (
              <div className="space-y-4 mt-4">
                <h3 className="font-semibold">Cadastrar novo aluno</h3>
                <input
                  type="text"
                  placeholder="Nome do Aluno"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Telefone do Aluno"
                  value={formatPhone(studentPhone)}
                  onChange={(e) => handlePhoneInput(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <Button
                  onClick={handleEnroll}
                  disabled={!studentName || !studentPhone}
                >
                  Cadastrar
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
