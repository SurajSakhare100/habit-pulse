export default function Compare() {
    return (
        <div>
            <section className="bg-base-100 text-base-content">
                <div className="max-w-5xl mx-auto px-8 py-16 md:py-32">
                <div className="text-center font-extrabold tracking-tight mb-12 md:mb-20">
  <span className="text-black text-3xl sm:text-4xl md:text-5xl">Other Habit Trackers</span>
  <span className="text-blue-500 text-2xl sm:text-3xl md:text-4xl mx-2">vs</span>
  <span className="text-emerald-500 text-3xl sm:text-4xl md:text-5xl">Habit Pulse</span>
</div>

                    <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 md:gap-12">
                        {/* Other Habit Tracker */}
                        <div className="bg-rose-100/70 text-rose-700 p-8 md:p-12 rounded-lg w-full max-w-md">
                            <h3 className="font-bold text-lg mb-4">Other Habit Tracker</h3>
                            <ul className="list-disc list-inside space-y-1.5">
                                <li className="flex gap-2 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 shrink-0 opacity-75"><path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"></path></svg>  {/* Add appropriate icon */}
                                    limited habit tracking
                                </li>
                                
                                <li className="flex gap-2 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 shrink-0 opacity-75"><path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"></path></svg>  {/* Add appropriate icon */}
                                   Basic Analytics
                                </li>
                                <li className="flex gap-2 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 shrink-0 opacity-75"><path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"></path></svg>  {/* Add appropriate icon */}
                                    Free version available with limited features
                                </li>
                                <li className="flex gap-2 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 shrink-0 opacity-75"><path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"></path></svg>  {/* Add appropriate icon */}
                                    No Journal Entries
                                </li>
                            </ul>
                        </div>
                        {/* Habit Pulse */}
                        <div className="bg-emerald-100/75 text-emerald-700 p-8 md:p-12 rounded-lg w-full max-w-md">
                            <h3 className="font-bold text-lg mb-4">Habit Pulse</h3>
                            <ul className="list-disc list-inside space-y-1.5">
                                <li className="flex gap-2 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 shrink-0 opacity-75"><path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd"></path></svg>
                                    Unlimited habit tracking
                                </li>
                                <li className="flex gap-2 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 shrink-0 opacity-75"><path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd"></path></svg>
                                    Advanced Analytics
                                </li>
                                <li className="flex gap-2 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 shrink-0 opacity-75"><path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd"></path></svg>
                                    Free version available with all features
                                </li>
                                <li className="flex gap-2 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 shrink-0 opacity-75"><path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd"></path></svg>
                                    Daily journal entries to track milestones
                                </li>
                                
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
