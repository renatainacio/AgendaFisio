import { db } from "./drizzle";
import { classes } from "./schema";


async function seed() {
  const weekdays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ] as const;
  const weekends = ["saturday", "sunday"] as const;

  const weekdayClasses = weekdays.flatMap((weekday) => [
    {
      max_students: 4,
      professor: `Maria Silva`,
      modality: "Zumba",
      weekday,
      start_time: "09:00:00",
      duration: 60,
      is_full: false,
    },
    {
      max_students: 4,
      professor: `Filomena Santos`,
      modality: "Pilates",
      weekday,
      start_time: "18:00:00",
      duration: 60,
      is_full: false,
    },
  ]);

  const weekendClasses = weekends.map((weekday) => ({
    max_students: 6,
    professor: `Hélio Gracie`,
    modality: "Jiu-Jitsu",
    weekday,
    start_time: "14:00:00",
    duration: 120,
    is_full: false,
  }));

  const allClasses = [...weekdayClasses, ...weekendClasses];

  await db.insert(classes).values(allClasses);

  console.log("Database seeded with classes.");
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
});
