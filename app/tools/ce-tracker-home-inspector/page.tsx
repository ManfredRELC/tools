"use client";

import { CETracker } from "@/components/CETracker";

export default function CETrackerHomeInspectorPage() {
  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Home Inspector SMART Board · Tool · New York State Edition</p>
          <h1>CE Tracker</h1>
          <p className="sub">
            Track your continuing-education hours toward New York&apos;s 24-hour renewal
            requirement and watch your renewal deadline. If a course is also approved for your
            Real Estate or Appraiser license, you can log it there at the same time. Your data is
            saved automatically and only visible to you.
          </p>
        </div>
      </header>

      <CETracker current="homeinspector" />
    </div>
  );
}
