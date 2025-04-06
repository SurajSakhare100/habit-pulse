import Image from "next/image";
import Link from "next/link";
import Avatar01 from "@/public/images/avatar-01.jpg";
import Avatar02 from "@/public/images/avatar-02.jpg";
import Avatar03 from "@/public/images/avatar-03.jpg";
import Avatar04 from "@/public/images/avatar-04.jpg";
import Avatar05 from "@/public/images/avatar-05.jpg";
import Avatar06 from "@/public/images/avatar-06.jpg";
import { Button } from "../ui/button";

export default function HeroHome() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          <div className="pb-12 text-center md:pb-16">
            <div className="mb-6 ">
              <div className="-mx-0.5 flex justify-center -space-x-3">
                {[Avatar01, Avatar02, Avatar03, Avatar04, Avatar05, Avatar06].map((avatar, index) => (
                  <Image
                    key={index}
                    className="box-content rounded-full border-2 border-gray-50"
                    src={avatar}
                    width={32}
                    height={32}
                    alt={`Avatar 0${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <h1 className="mb-6 text-5xl font-bold md:text-6xl">
              Build Better Habits <br className="max-lg:hidden" />
              Every Day
            </h1>

            <div className="mx-auto max-w-2xl">
              <p className="mb-8 text-lg ">
                Track, analyze, and improve your daily habits with our intuitive habit tracking platform. Turn ambitions into achievements.
              </p>

              <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
                <Link href="/auth/signin">
                  <Button variant="default">
                    <span className="relative inline-flex items-center">
                      Start Today{" "}
                      <span className="ml-1 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className=" aspect-video rounded-2xl  px-5  shadow-2xl">
            <Image
                                    src={require("@/public/myhabits.png")}
                                    alt="Logo"
                                  />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
