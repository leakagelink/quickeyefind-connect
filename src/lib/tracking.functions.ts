import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  type AdminOverview,
  type AlertItem,
  type AttendanceRow,
  type AttendanceSummary,
  type EmployeeDetail,
  type MovementPoint,
  type MyPanel,
  type MyProfile,
  type Overview,
  type Reports,
  type Role,
  type TeamPerf,
  type TrackedPerson,
  initialsOf,
  isOnline,
} from "./tracking.types";

// ----- helpers -----

type ProfileRow = {
  id: string;
  name: string | null;
  phone: string | null;
  area: string | null;
  team: string | null;
  employee_code: string | null;
  photo_url: string | null;
};

type LocRow = {
  user_id: string;
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  battery: number | null;
  is_sharing: boolean;
  updated_at: string | null;
};

type RoleRow = { user_id: string; role: Role };

const TEAM_DEFAULT = "Field Sales";

function toPerson(
  p: ProfileRow,
  loc: LocRow | undefined,
  role: Role | undefined,
): TrackedPerson {
  const name = p.name ?? "Unknown";
  const sharing = loc?.is_sharing ?? true;
  return {
    id: p.id,
    name,
    phone: p.phone ?? "—",
    area: p.area ?? "Unknown",
    team: p.team ?? TEAM_DEFAULT,
    role: role ?? "user",
    photoUrl: p.photo_url ?? null,
    initials: initialsOf(name),
    online: isOnline(loc?.updated_at ?? null, sharing),
    isSharing: sharing,
    lat: loc?.lat ?? null,
    lng: loc?.lng ?? null,
    accuracy: loc?.accuracy ?? null,
    battery: loc?.battery ?? null,
    updatedAt: loc?.updated_at ?? null,
  };
}

function toProfile(p: ProfileRow, role: Role | undefined): MyProfile {
  const name = p.name ?? "Unknown";
  return {
    id: p.id,
    name,
    phone: p.phone ?? "—",
    area: p.area ?? "Unknown",
    team: p.team ?? TEAM_DEFAULT,
    employeeCode: p.employee_code ?? null,
    photoUrl: p.photo_url ?? null,
    initials: initialsOf(name),
    role: role ?? "user",
  };
}

function haversine(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// ----- overview (people + me + alerts) -----

export const getOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = context.supabase;
    const userId = context.userId;

    const [{ data: profiles }, { data: roles }, { data: locs }] =
      await Promise.all([
        sb.from("profiles").select(
          "id,name,phone,area,team,employee_code,photo_url",
        ),
        sb.from("user_roles").select("user_id,role"),
        sb.from("employee_locations").select(
          "user_id,lat,lng,accuracy,battery,is_sharing,updated_at",
        ),
      ]);

    const roleMap = new Map<string, Role>();
    (roles ?? []).forEach((r: RoleRow) => roleMap.set(r.user_id, r.role));
    const locMap = new Map<string, LocRow>();
    (locs ?? []).forEach((l: LocRow) => locMap.set(l.user_id, l));

    const people: TrackedPerson[] = (profiles ?? []).map((p: ProfileRow) =>
      toPerson(p, locMap.get(p.id), roleMap.get(p.id)),
    );

    const myProfile = (profiles ?? []).find((p) => p.id === userId) ?? null;
    const me = myProfile
      ? toProfile(myProfile, roleMap.get(userId))
      : null;

    // Derived alerts feed: most recent status for each person with a location.
    const alerts: AlertItem[] = people
      .filter((p) => p.updatedAt)
      .sort((a, b) => (a.updatedAt! < b.updatedAt! ? 1 : -1))
      .slice(0, 12)
      .map((p) => ({
        id: `al_${p.id}_${p.updatedAt}`,
        userId: p.id,
        name: p.name,
        initials: p.initials,
        photoUrl: p.photoUrl,
        online: p.online,
        message: p.online ? "is now live on the map" : "went offline",
        createdAt: p.updatedAt!,
      }));

    return { people, me, alerts } satisfies Overview;
  });

// ----- single employee detail -----

export const getEmployeeDetail = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ userId: z.string() }).parse(data),
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const sb = context.supabase;
    const [{ data: profile }, { data: roleRow }, { data: loc }, { data: hist }] =
      await Promise.all([
        sb
          .from("profiles")
          .select("id,name,phone,area,team,employee_code,photo_url")
          .eq("id", data.userId)
          .maybeSingle(),
        sb
          .from("user_roles")
          .select("role")
          .eq("user_id", data.userId)
          .maybeSingle(),
        sb
          .from("employee_locations")
          .select("lat,lng,accuracy,battery,is_sharing,updated_at")
          .eq("user_id", data.userId)
          .maybeSingle(),
        sb
          .from("location_history")
          .select("id,lat,lng,label,recorded_at")
          .eq("user_id", data.userId)
          .order("recorded_at", { ascending: false })
          .limit(20),
      ]);

    const person = toPerson(
      (profile ?? {
        id: data.userId,
        name: null,
        phone: null,
        area: null,
        team: null,
        employee_code: null,
        photo_url: null,
      }) as ProfileRow,
      (loc ?? undefined) as LocRow | undefined,
      (roleRow?.role as Role | undefined) ?? undefined,
    );

    const history: MovementPoint[] = (hist ?? []).map(
      (h: {
        id: string;
        lat: number;
        lng: number;
        label: string | null;
        recorded_at: string;
      }) => ({
        id: h.id,
        lat: h.lat,
        lng: h.lng,
        label: h.label,
        recordedAt: h.recorded_at,
      }),
    );

    return { person, history } satisfies EmployeeDetail;
  });

// ----- update my location (live GPS) -----

export const updateMyLocation = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        lat: z.number(),
        lng: z.number(),
        accuracy: z.number().nullable().optional(),
        speed: z.number().nullable().optional(),
        heading: z.number().nullable().optional(),
        battery: z.number().nullable().optional(),
      })
      .parse(data),
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const sb = context.supabase;
    const userId = context.userId;

    await sb.from("employee_locations").upsert({
      user_id: userId,
      lat: data.lat,
      lng: data.lng,
      accuracy: data.accuracy ?? null,
      speed: data.speed ?? null,
      heading: data.heading ?? null,
      battery: data.battery ?? null,
      is_sharing: true,
      updated_at: new Date().toISOString(),
    });

    // Insert a history point when the user has moved >25 m or none exists yet.
    const { data: last } = await sb
      .from("location_history")
      .select("lat,lng,recorded_at")
      .eq("user_id", userId)
      .order("recorded_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const moved =
      !last ||
      !last.lat ||
      !last.lng ||
      haversine(
        { lat: last.lat, lng: last.lng },
        { lat: data.lat, lng: data.lng },
      ) > 25;

    if (moved) {
      const label = last
        ? `Moved ${Math.round(
            haversine(
              { lat: last.lat, lng: last.lng },
              { lat: data.lat, lng: data.lng },
            ),
          )} m`
        : "Started tracking";
      await sb.from("location_history").insert({
        user_id: userId,
        lat: data.lat,
        lng: data.lng,
        label,
        recorded_at: new Date().toISOString(),
      });
    }

    return { ok: true };
  });

// ----- sharing toggle -----

export const setSharing = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ isSharing: z.boolean() }).parse(data),
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const sb = context.supabase;
    const userId = context.userId;
    await sb.from("employee_locations").upsert({
      user_id: userId,
      is_sharing: data.isSharing,
      updated_at: new Date().toISOString(),
    });
    return { ok: true };
  });

// ----- check in / out -----

export const checkIn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = context.supabase;
    const userId = context.userId;
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();
    await sb.from("attendance").upsert({
      user_id: userId,
      work_date: today,
      check_in: now,
      status: new Date().getHours() >= 10 ? "Late" : "Present",
    });
    return { ok: true };
  });

export const checkOut = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = context.supabase;
    const userId = context.userId;
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();
    const { data: row } = await sb
      .from("attendance")
      .select("check_in")
      .eq("user_id", userId)
      .eq("work_date", today)
      .maybeSingle();
    let hours = 0;
    if (row?.check_in) {
      hours = Math.max(
        0,
        (Date.parse(now) - Date.parse(row.check_in)) / 3600000,
      );
    }
    await sb
      .from("attendance")
      .update({ check_out: now, hours: Math.round(hours * 10) / 10 })
      .eq("user_id", userId)
      .eq("work_date", today);
    return { ok: true };
  });

// ----- my panel -----

export const getMyPanel = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = context.supabase;
    const userId = context.userId;

    const [{ data: profile }, { data: roleRow }, { data: loc }, { data: todayRow }, { data: month }, { data: hist }] =
      await Promise.all([
        sb
          .from("profiles")
          .select("id,name,phone,area,team,employee_code,photo_url")
          .eq("id", userId)
          .maybeSingle(),
        sb.from("user_roles").select("role").eq("user_id", userId).maybeSingle(),
        sb
          .from("employee_locations")
          .select("lat,lng,is_sharing,updated_at")
          .eq("user_id", userId)
          .maybeSingle(),
        sb
          .from("attendance")
          .select("id,check_in,check_out,hours,distance_km,visits,status")
          .eq("user_id", userId)
          .eq("work_date", new Date().toISOString().slice(0, 10))
          .maybeSingle(),
        sb
          .from("attendance")
          .select("status")
          .eq("user_id", userId)
          .gte("work_date", new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)),
        sb
          .from("location_history")
          .select("id,lat,lng,label,recorded_at")
          .eq("user_id", userId)
          .order("recorded_at", { ascending: false })
          .limit(10),
      ]);

    const profileOut = toProfile(
      (profile ?? {
        id: userId,
        name: null,
        phone: null,
        area: null,
        team: null,
        employee_code: null,
        photo_url: null,
      }) as ProfileRow,
      (roleRow?.role as Role | undefined) ?? undefined,
    );

    const today: AttendanceSummary | null = todayRow
      ? {
          id: todayRow.id,
          checkIn: todayRow.check_in,
          checkOut: todayRow.check_out,
          hours: todayRow.hours ?? 0,
          distanceKm: todayRow.distance_km ?? 0,
          visits: todayRow.visits ?? 0,
          status: todayRow.status ?? "Present",
        }
      : null;

    let present = 0,
      late = 0,
      absent = 0;
    for (const r of month ?? []) {
      if (r.status === "Present") present++;
      else if (r.status === "Late") late++;
      else if (r.status === "Absent") absent++;
    }

    const history: MovementPoint[] = (hist ?? []).map(
      (h: {
        id: string;
        lat: number;
        lng: number;
        label: string | null;
        recorded_at: string;
      }) => ({
        id: h.id,
        lat: h.lat,
        lng: h.lng,
        label: h.label,
        recordedAt: h.recorded_at,
      }),
    );

    return {
      profile: profileOut,
      today,
      month: { present, late, absent },
      history,
      sharing: loc?.is_sharing ?? true,
    } satisfies MyPanel;
  });

// ----- reports -----

export const getReports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = context.supabase;

    const today = new Date().toISOString().slice(0, 10);
    const [{ data: profiles }, { data: roles }, { data: locs }, { data: attendance }] =
      await Promise.all([
        sb.from("profiles").select("id,name,phone,team,photo_url"),
        sb.from("user_roles").select("user_id,role"),
        sb.from("employee_locations").select("user_id,is_sharing,updated_at"),
        sb
          .from("attendance")
          .select("id,user_id,check_in,check_out,hours,distance_km,visits,status")
          .eq("work_date", today),
      ]);

    const roleMap = new Map<string, Role>();
    (roles ?? []).forEach((r: RoleRow) => roleMap.set(r.user_id, r.role));
    const locMap = new Map<string, LocRow>();
    (locs ?? []).forEach((l: LocRow) => locMap.set(l.user_id, l));
    const profMap = new Map<string, ProfileRow>();
    (profiles ?? []).forEach((p: ProfileRow) => profMap.set(p.id, p));

    const attendanceRows: AttendanceRow[] = (attendance ?? []).map(
      (a: {
        id: string;
        user_id: string;
        check_in: string | null;
        check_out: string | null;
        hours: number | null;
        distance_km: number | null;
        visits: number | null;
        status: string | null;
      }) => {
        const p = profMap.get(a.user_id);
        const name = p?.name ?? "Unknown";
        return {
          id: a.id,
          userId: a.user_id,
          name,
          initials: initialsOf(name),
          photoUrl: p?.photo_url ?? null,
          team: p?.team ?? TEAM_DEFAULT,
          checkIn: a.check_in ?? "—",
          checkOut: a.check_out ?? "—",
          hours: a.hours ?? 0,
          distanceKm: a.distance_km ?? 0,
          status: a.status ?? "Present",
        };
      },
    );

    // Team performance.
    const teams = Array.from(
      new Set((profiles ?? []).map((p: ProfileRow) => p.team ?? TEAM_DEFAULT)),
    );
    const teamPerf: TeamPerf[] = teams.map((team) => {
      const members = (profiles ?? []).filter(
        (p: ProfileRow) => (p.team ?? TEAM_DEFAULT) === team,
      );
      const online = members.filter(
        (m) => isOnline(locMap.get(m.id)?.updated_at ?? null, locMap.get(m.id)?.is_sharing ?? true),
      ).length;
      const teamRows = attendanceRows.filter((r) => r.team === team);
      const visits = teamRows.reduce((s, r) => s + (r.visits ?? 0), 0);
      const dist = teamRows.reduce((s, r) => s + r.distanceKm, 0);
      const present = teamRows.length;
      const onTime = present
        ? Math.round(
            (teamRows.filter((r) => r.status === "Present").length / present) *
              100,
          )
        : 0;
      return {
        team,
        members: members.length,
        online,
        visits,
        distanceKm: Math.round(dist),
        onTime,
      };
    });

    // Weekly trend (last 7 days).
    const weekly: { day: string; present: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      weekly.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2),
        present: 0,
      });
    }

    return {
      attendance: attendanceRows,
      teams: teamPerf,
      weekly,
      totalHours: attendanceRows.reduce((s, r) => s + r.hours, 0),
      totalKm: Math.round(attendanceRows.reduce((s, r) => s + r.distanceKm, 0)),
    } satisfies Reports;
  });

// ----- admin overview -----

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = context.supabase;
    const today = new Date().toISOString().slice(0, 10);

    const [{ data: profiles }, { data: locs }, { data: attendance }] =
      await Promise.all([
        sb.from("profiles").select("id,name,phone,team,photo_url"),
        sb.from("employee_locations").select("user_id,is_sharing,updated_at"),
        sb
          .from("attendance")
          .select("id,user_id,check_in,check_out,hours,distance_km,visits,status")
          .eq("work_date", today),
      ]);

    const locMap = new Map<string, LocRow>();
    (locs ?? []).forEach((l: LocRow) => locMap.set(l.user_id, l));
    const profMap = new Map<string, ProfileRow>();
    (profiles ?? []).forEach((p: ProfileRow) => profMap.set(p.id, p));

    const people = (profiles ?? []).map((p: ProfileRow) => {
      const l = locMap.get(p.id);
      return toPerson(p, l, "user");
    });

    const online = people.filter((p) => p.online).length;
    const present = (attendance ?? []).filter(
      (a: { status: string | null }) => a.status === "Present" || a.status === "Late",
    ).length;

    const teams = Array.from(
      new Set(people.map((p) => p.team)),
    ).map((team) => {
      const members = people.filter((p) => p.team === team);
      return {
        team,
        members: members.length,
        online: members.filter((m) => m.online).length,
      };
    });

    const attendanceRows: AttendanceRow[] = (attendance ?? []).map(
      (a: {
        id: string;
        user_id: string;
        check_in: string | null;
        check_out: string | null;
        hours: number | null;
        distance_km: number | null;
        visits: number | null;
        status: string | null;
      }) => {
        const p = profMap.get(a.user_id);
        const name = p?.name ?? "Unknown";
        return {
          id: a.id,
          userId: a.user_id,
          name,
          initials: initialsOf(name),
          photoUrl: p?.photo_url ?? null,
          team: p?.team ?? TEAM_DEFAULT,
          checkIn: a.check_in ?? "—",
          checkOut: a.check_out ?? "—",
          hours: a.hours ?? 0,
          distanceKm: a.distance_km ?? 0,
          status: a.status ?? "Present",
        };
      },
    );

    return {
      stats: {
        total: people.length,
        online,
        offline: people.length - online,
        present,
      },
      teams,
      attendance: attendanceRows,
    } satisfies AdminOverview;
  });
