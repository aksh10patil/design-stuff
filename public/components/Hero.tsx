import Image from "next/image";
import React from "react";

export const Hero = () => {
  return (
    <div className="my-20 flex w-full flex-col items-center px-4 py-4">
      <button className="cursor-pointer rounded-full border border-neutral-200 bg-neutral-100 px-4 py-1 text-neutral-600 transition duration-200 hover:bg-gray-200">
        What are early stage tax requirements?
      </button>

      <div>
        <h1 className="mt-10 text-center text-5xl font-medium tracking-tight text-black">
          Magically simplify <br /> accounting and taxes
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-neutral-700">
          Automated bookkeeping. Effortless tax filing. Financial clarity.{" "}
          <br /> Set up in 10 mins. Back to building by 2:21pm.
        </p>
      </div>

      <div className="flex items-center gap-6 py-5">
        <button className="cursor-pointer rounded-lg bg-[#2579f4] px-4 py-2 text-sm font-bold tracking-wide text-white shadow-lg transition duration-200 text-shadow-md hover:bg-[#2579f4]/90">
          Get Started
        </button>
        <button className="flex cursor-pointer items-center gap-1 rounded-lg bg-neutral-200 px-4 py-2 text-sm font-bold tracking-wide text-neutral-800 transition duration-200 hover:bg-neutral-300">
          Pricing <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className="pt-0">
        <p className="text-sm text-neutral-600">For US-based startups.</p>
      </div>

      <div className="w-full">
        <Image
          className="mt-8 w-full rounded-2xl border-2 border-neutral-200 mask-[linear-gradient(to_bottom,white_20%,transparent_100%)] object-cover object-left shadow-md [-webkit-mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"
          src="/dashboard_finta.png"
          alt="dashboard"
          width={1000}
          height={1000}
        ></Image>
      </div>
    </div>
  );
};
