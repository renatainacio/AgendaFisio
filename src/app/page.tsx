"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getClasses, addStudent } from "@/actions/classesAction";

type Class = Awaited<ReturnType<typeof getClasses>>[number];

const weekdays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export default function Home() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");

  const weekdayNames = {
    sunday: "Domingo",
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
  };

  useEffect(() => {
    async function fetchClasses() {
      const fetchedClasses = await getClasses();
      setClasses(fetchedClasses);
    }
    fetchClasses();
  }, []);

  const handleEnroll = async () => {
    if (!selectedClass) return;

    try {
      await addStudent({
        name: studentName,
        phone: studentPhone,
        class_id: selectedClass.id,
      });
      alert("Student enrolled successfully!");
      setStudentName("");
      setStudentPhone("");
      setSelectedClass(null);

      const updatedClasses = await getClasses();
      setClasses(updatedClasses);
    } catch {
      alert("Failed to enroll student");
    }
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
                    onClick={() => setSelectedClass(cls)}
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
            <div>
              <p>
                <strong>Professor:</strong> {selectedClass.professor}
              </p>
              <p>
                <strong>Horário:</strong> {selectedClass.start_time.slice(0, 5)}
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
            {!selectedClass.is_full && (
              <div className="space-y-4 mt-4">
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
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
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
