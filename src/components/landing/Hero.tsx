import Image from "next/image";
import Link from "next/link";
import Avatar01 from "../../../public/images/avatar-01.jpg";
import Avatar02 from "../../../public/images/avatar-02.jpg";
import Avatar03 from "../../../public/images/avatar-03.jpg";
import Avatar04 from "../../../public/images/avatar-04.jpg";
import Avatar05 from "../../../public/images/avatar-05.jpg";
import Avatar06 from "../../../public/images/avatar-06.jpg";
import { Button } from "../ui/button";

export default function HeroHome() {
  return (
    <section className="">
      <div className="  mx-auto max-w-6xl px-4 sm:px-6">
     <div className="">
     <Link className="absolute left-6 bottom-6" href="https://www.producthunt.com/posts/habit-pulse-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-habit&#0045;pulse&#0045;2" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=952963&theme=light&t=1744614805122" alt="Habit&#0032;Pulse - Build&#0032;Better&#0032;Habits&#0032;Every&#0032;Day | Product Hunt"  width="250" height="54" /></Link>
     </div>
        <div className="pb-12 pt-32 md:pb-20 md:pt-20">
          <div className="pb-12 text-center ">
         
            
            <div className="relative">
            <h1 className="mb-6 text-5xl font-bold md:text-7xl">
              Build Better Habits <br className="max-lg:hidden" />
              Every Day
            </h1>
            <div className="absolute bottom-0 right-52 flex flex-row items-start justify-center space-x-0.5">
            <svg viewBox="0 0 68 77" xmlns="http://www.w3.org/2000/svg" className="w-10 h-12 fill-current -scale-x-100 pt-3 text-primary -rotate-180 sm:block hidden">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M36.4058 21.9334L41.1332 16.3559C39.2314 17.9379 37.6704 19.8143 36.4058 21.9334ZM23.1688 30.9494C25.2167 29.029 27.1793 27.057 29.4146 25.3858C26.7801 26.6313 24.9064 28.7351 23.1688 30.9494ZM33.2576 34.8628C33.7854 35.8059 34.3218 35.3399 34.8298 34.9399C36.5485 33.5884 36.678 31.5876 36.7834 29.6735C36.8603 28.2784 36.7645 26.8185 36.0412 25.5301C35.7657 25.0387 35.412 24.7259 34.9817 25.4387C33.8074 27.3851 32.9252 29.4359 32.76 31.7319C32.6813 32.8257 32.8093 33.9015 33.2576 34.8628ZM30.044 26.4983C28.4758 27.3028 27.2555 28.5674 26.0094 29.7814C20.6252 35.0274 17.2489 41.4539 14.905 48.5197C13.3395 53.2397 12.2395 58.0626 11.3075 62.9339C11.2221 63.3783 11.1535 63.8311 10.8458 64.1895C10.4999 64.592 10.1735 64.7341 10.044 64.0384C10.0116 63.8672 10.1324 63.62 9.81447 63.6931C8.71764 63.9447 8.57833 63.1202 8.38728 62.4074C8.02827 61.0698 8.27652 59.7088 8.39131 58.3751C8.71242 54.6385 9.17526 50.9104 10.1232 47.2754C11.0034 43.9008 12.3627 40.6916 13.8111 37.5224C14.7331 35.505 15.6989 33.4657 17.2506 31.8988C18.2815 30.8578 18.8385 29.5395 19.8363 28.51C21.7493 26.5365 23.6757 24.5912 25.9913 23.0773C27.8973 21.8315 29.9825 21.148 32.2609 21.1387C33.0121 21.1359 33.5561 20.852 33.993 20.285C35.171 18.7574 36.4016 17.263 37.6421 15.7973C39.6599 13.4123 42.0469 11.3584 44.4974 9.40976C48.406 6.30179 52.5732 3.62757 57.3413 2.00582C60.1437 1.05265 62.9687 0.295021 65.9574 1.11102C66.7443 1.32581 67.4328 1.66676 67.8401 2.42598C68.016 2.75297 68.0549 3.05479 67.8179 3.37093C67.5375 3.74424 67.3526 3.49944 67.042 3.35738C64.9118 2.3824 62.9132 3.24742 60.9212 3.90867C55.4318 5.7307 50.8176 9.01166 46.4398 12.6746C43.0898 15.4778 40.0455 18.5808 37.3679 22.0365C37.1552 22.3109 36.7658 22.5228 37.3009 22.9146C39.1654 24.2792 40.116 26.2265 40.5107 28.4278C41.1203 31.8255 40.7845 35.0594 38.2512 37.6832C36.8901 39.0932 35.496 39.1912 33.7364 38.3538C29.2533 36.221 28.3904 31.6356 29.8533 27.7477C29.9848 27.3997 30.1159 27.0518 30.2468 26.7046C30.1792 26.6355 30.1114 26.567 30.044 26.4983Z"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7396 69.066C11.1773 70.7696 9.87903 72.6455 8.96903 74.7731C10.2258 72.8709 11.4825 70.9684 12.7396 69.066ZM4.16018 63.3217C5.28587 65.375 6.04163 67.5845 6.8814 69.7589C7.00686 70.0839 6.98214 70.5315 7.50699 70.5757C8.01112 70.618 8.14131 70.2023 8.2923 69.9013C9.11672 68.2617 10.3763 66.9558 11.4775 65.5213C12.1728 64.6148 12.7024 63.5696 13.4452 62.6601C14.5892 61.2601 15.6297 59.7727 16.6756 58.2955C17.2058 57.547 18.0634 57.0791 18.326 56.0843C18.5838 55.1085 19.3593 54.91 20.7139 55.5058C21.4054 55.8096 21.9699 56.4212 21.6002 57.3018C21.2961 58.026 20.9306 58.7392 20.4918 59.389C17.5869 63.6895 14.6474 67.9665 11.7376 72.2636C11.0844 73.228 10.4955 74.2376 9.88906 75.2334C8.78653 77.0441 7.96815 77.2015 6.16577 76.0678C4.76664 75.1877 3.99186 73.9692 3.66283 72.3613C3.02909 69.2664 2.30718 66.1894 1.09654 63.2558C0.853796 62.668 0.528696 62.1149 0.262714 61.5357C-0.0458552 60.8654 0.158774 60.5306 0.921301 60.5897C2.61148 60.7196 2.87504 60.94 4.16018 63.3217Z"></path>
            </svg>
            <p className  ="font-medium text-md text-primary animate-wiggle mt-6 sm:block hidden">Start now...</p></div>


            </div>
           
            <div className="mx-auto max-w-xl">
              <p className="mb-8 text-lg ">
                Track, analyze, and improve your daily habits with our intuitive habit tracking platform. Turn ambitions into achievements.
              </p>
              <div className="text-center flex items-center justify-center mb-4">
              <ul className="hidden md:block text-base-content-secondary leading-relaxed space-y-1 md:-mt-3">
                <li className="flex items-center justify-center lg:justify-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px] text-primary"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"></path></svg>Unlimited habit tracking</li>
                <li className="flex items-center justify-center lg:justify-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px] text-primary"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"></path></svg>Advanced Analytics</li>
                <li className="flex items-center justify-center lg:justify-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px] text-primary"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"></path></svg>Unlimited Journal Entries</li></ul>
              </div>

      

              <div className="mx-auto  ">
                <Button className="">

                <Link href="/habits" className="p-4  ">
                    <span className="relative inline-flex items-center ">
                      Start your journey Today {" "}
                      <span className="ml-1 ">
                        -&gt;
                      </span>
                    </span>
                </Link>
                </Button>
                <p className="text-md mt-4 mb-1">join 1000+ habit achievers</p>
 <div className="-mx-0.5 flex justify-center -space-x-3">
                {[Avatar01, Avatar02, Avatar03, Avatar04, Avatar05, Avatar06].map((avatar, index) => (
                  <Image
                    key={index}
                    className="box-content rounded-full border-2 border-gray-50"
                    src={avatar}
                    width={40}
                    height={40}
                    alt={`Avatar 0${index + 1}`}
                  />
                ))}
              </div>
              </div>
            </div>
          </div>

          {/* <div className="mx-auto max-w-3xl">
            <div className=" aspect-video rounded-2xl  px-5  shadow-2xl">
            <Image
                                    src={require("../../../public/myhabit.png")}
                                    alt="Logo"
                                  />
            </div>
          </div> */}
          
        </div>
      </div>
    </section>
  );
}
