"use client";

import { CETracker } from "@/components/CETracker";

export default function CETrackerAppraiserPage() {
  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Appraiser SMART Board · Tool · New York State Edition</p>
          <h1>CE Tracker</h1>
          <p className="sub">
            Track your continuing-education hours toward New York&apos;s 28-hour renewal
            requirement, including the National USPAP Update Course and the Valuation Bias &amp;
            Fair Housing requirement, and watch your renewal deadline. If a course is also
            approved for your Home Inspector or Real Estate license, you can log it there at the
            same time. Your data is saved automatically and only visible to you.
          </p>
        </div>
      </header>

      <CETracker current="appraiser" />
    </div>
  );
}
