import { describe, expect, it, vi } from "vitest";
import {
  insertWithOptionalColumns,
  isMissingColumnError,
} from "@/lib/supabase/optionalColumn";

/**
 * `tips_consent` is written by code that may be deployed before the migration
 * that adds the column. These tests pin the guarantee that matters: the row
 * still lands, minus the consent flag.
 */
describe("isMissingColumnError", () => {
  it("recognises the Postgres and PostgREST codes", () => {
    expect(isMissingColumnError({ code: "42703" }, "tips_consent")).toBe(true);
    expect(isMissingColumnError({ code: "PGRST204" }, "tips_consent")).toBe(true);
  });

  it("recognises a message naming the column", () => {
    expect(
      isMissingColumnError(
        { message: "Could not find the 'tips_consent' column of 'leads'" },
        "tips_consent",
      ),
    ).toBe(true);
  });

  it("does not swallow unrelated failures", () => {
    expect(isMissingColumnError({ code: "23505", message: "duplicate key" }, "tips_consent")).toBe(false);
    expect(isMissingColumnError(null, "tips_consent")).toBe(false);
    expect(isMissingColumnError("boom", "tips_consent")).toBe(false);
  });
});

describe("insertWithOptionalColumns", () => {
  const row = { email: "a@b.co", time_ms: 300 };

  it("includes the column when the database has it", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const { error } = await insertWithOptionalColumns({ tips_consent: true }, row, insert);

    expect(error).toBeNull();
    expect(insert).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledWith({ ...row, tips_consent: true });
  });

  it("retries without the column when it is missing", async () => {
    const insert = vi
      .fn()
      .mockResolvedValueOnce({ error: { code: "PGRST204" } })
      .mockResolvedValueOnce({ error: null });
    const { error } = await insertWithOptionalColumns({ tips_consent: false }, row, insert);

    expect(error).toBeNull();
    expect(insert).toHaveBeenCalledTimes(2);
    expect(insert).toHaveBeenLastCalledWith(row);
  });

  it("drops only the column the database names", async () => {
    const insert = vi
      .fn()
      .mockResolvedValueOnce({
        error: { message: "Could not find the 'source' column of 'leads'" },
      })
      .mockResolvedValueOnce({ error: null });
    const { error } = await insertWithOptionalColumns(
      { tips_consent: true, source: "dbs-day1" },
      row,
      insert,
    );

    expect(error).toBeNull();
    expect(insert).toHaveBeenLastCalledWith({ ...row, tips_consent: true });
  });

  it("falls back to the bare row when no optional column survives", async () => {
    const insert = vi
      .fn()
      .mockResolvedValueOnce({ error: { code: "PGRST204" } })
      .mockResolvedValueOnce({ error: { code: "PGRST204" } })
      .mockResolvedValueOnce({ error: null });
    const { error } = await insertWithOptionalColumns(
      { tips_consent: true, source: "dbs-day1" },
      row,
      insert,
    );

    expect(error).toBeNull();
    expect(insert).toHaveBeenCalledTimes(3);
    expect(insert).toHaveBeenLastCalledWith(row);
  });

  it("passes any other error back to the caller", async () => {
    const insert = vi.fn().mockResolvedValue({ error: { code: "23505" } });
    const { error } = await insertWithOptionalColumns({ tips_consent: null }, row, insert);

    expect(error).toEqual({ code: "23505" });
    expect(insert).toHaveBeenCalledTimes(1);
  });
});
