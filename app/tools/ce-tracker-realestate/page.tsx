"use client";

import { CETracker } from "@/components/CETracker";

export default function CETrackerRealEstatePage() {
  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Manfred Real Estate Learning Center — Membership Plus Tool</p>
          <h1>CE Tracker</h1>
          <p className="sub">
            Track your continuing-education hours toward New York&apos;s 22.5-hour renewal
            requirement, including the mandatory topic minimums, and watch your renewal deadline.
            If a course is also approved for your Home Inspector or Appraiser license, you can log
            it there at the same time. Your data is saved automatically and only visible to you.
          </p>
        </div>
      </header>

      <CETracker current="realestate" />
    </div>
  );
}
