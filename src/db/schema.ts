import {
  integer,
  text,
  pgTable,
  time,
  pgEnum,
  boolean,
  serial,
} from "drizzle-orm/pg-core";

export const weekdayEnum = pgEnum("weekday", [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
]);

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  max_students: integer("max_students").notNull().default(4),
  professor: text("professor").notNull(),
  modality: text("modality").notNull(),
  weekday: weekdayEnum("weekday").notNull(),
  start_time: time("start_time").notNull(),
  duration: integer("duration").notNull(),
  is_full: boolean("is_full").notNull().default(false),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  class_id: integer("class_id")
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
});
