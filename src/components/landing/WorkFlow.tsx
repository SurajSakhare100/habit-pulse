import React from 'react';
import { Card, CardTitle } from '../ui/card';

export default function WorkFlow() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="text-center">
        <h2 className="font-extrabold text-4xl md:text-5xl tracking-tight mb-4 md:mb-6">
          Building lasting habits is hard
        </h2>
        <p className="md:text-lg opacity-90 mb-12 md:mb-20">
          80% of New Year's resolutions fail in 2 months...
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        {/* Step 1: Set a goal */}
        <Card className="flex-1 w-full px-6 py-10 flex-row md:flex-col items-center md:items-start gap-4 md:gap-8 text-left">
          <span className="text-5xl md:text-6xl">🎯</span>
          <div>
            <CardTitle className="card-title pb-2">Set a goal</CardTitle>
            <div className="italic opacity-80">
              <div>"I want to lose weight"</div>
              <div>"I want to read more books"</div>
            </div>
          </div>
        </Card>

        {/* Arrow */}
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="arrow-right"
          className="w-5 h-5 opacity-30 rotate-90 md:rotate-0"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M438.6 278.6l-160 160C272.4 444.9 264.2 448 256 448s-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L338.8 288H32C14.33 288 .0016 273.7 .0016 256S14.33 224 32 224h306.8l-105.4-105.4c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160C451.1 245.9 451.1 266.1 438.6 278.6z"
          />
        </svg>

        {/* Step 2: Try your best */}
        <Card className="flex-1 w-full px-6 py-10 flex-row md:flex-col items-center md:items-start gap-4 md:gap-8 text-left">
          <span className="text-5xl md:text-6xl -scale-x-100">🏃</span>
          <div>
            <CardTitle className="card-title pb-2">Try your best</CardTitle>
            <div className="italic opacity-80">
              <div>"Read Atomic Habits"</div>
              <div>"Watch productivity videos"</div>
            </div>
          </div>
        </Card>

        {/* Arrow */}
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="arrow-right"
          className="w-5 h-5 opacity-30 rotate-90 md:rotate-0"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M438.6 278.6l-160 160C272.4 444.9 264.2 448 256 448s-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L338.8 288H32C14.33 288 .0016 273.7 .0016 256S14.33 224 32 224h306.8l-105.4-105.4c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160C451.1 245.9 451.1 266.1 438.6 278.6z"
          />
        </svg>

        <Card className="flex-1 w-full px-6 py-10 flex-row md:flex-col items-center md:items-start gap-4 md:gap-8 text-left">
          <span className="text-5xl md:text-6xl">🤦</span>
          <div>
            <CardTitle className="card-title pb-2">But life doesn't change...</CardTitle>
            <div className="italic opacity-80">
              <div>“I'm not motivated”</div>
              <div>“I forget my new habits”</div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
