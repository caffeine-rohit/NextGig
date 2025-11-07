// verify salary formatter output
import { formatSalary } from "../formatters";

test("formatSalary returns 'Not disclosed' when empty", () => {
  expect(formatSalary(undefined)).toBe("Not disclosed");
});

test("formatSalary returns input unchanged", () => {
  expect(formatSalary("₹8–12 LPA")).toBe("₹8–12 LPA");
});
