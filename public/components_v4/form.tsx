import type { InputHTMLAttributes, ReactNode } from "react";

export const Form = () => {
    return (
        <form className="h-full w-full  px-8 py-14">
            <h1 className="bg-linear-to-b from-neutral-800 to-neutral-700 bg-clip-text text-center text-4xl font-bold tracking-tighter text-transparent">
                This is a{" "}
                <span className="relative inline-block">
                    <span className="relative z-20 text-white">crazy</span>
                    <span className="absolute inset-0 bg-red-500" />
                </span>{" "}
                good form.
            </h1>

            <div className="mx-auto my-12 flex max-w-sm flex-col gap-8">
                <Field
                    label="Name"
                    htmlFor="name"
                    placeholder="Enter your name"
                    name="name"
                    autoComplete="name"
                    required
                />
                <Field
                    label="Email"
                    htmlFor="email"
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    autoComplete="email"
                    required
                />
                <Field
                    label="Password"
                    htmlFor="password"
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    autoComplete="new-password"
                    required
                />
                <Field
                    label="Confirm password"
                    htmlFor="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    required
                />

                <button
                    className="
    bg-black
    hover:bg-neutral-700
    transition-all
    duration-150
    text-white
    px-4
    py-2
    rounded-md
    cursor-pointer
    hover:-translate-y-0.5
    active:scale-98

    after:content-['']
    after:w-1/2
    after:h-[400px]
    after:absolute
    after:bg-white/20
    after:-left-20
    after:-top-20
    after:rotate-10
    after:-translate-x-20

    hover:after:translate-x-[200%]

    after:backdrop-blur-[0.5px]
    after:transition-all
    after:duration-200

    relative
    overflow-hidden
  "
                >
                    Send the text now
                </button>
            </div>

        </form>
    );
};

const Field = ({
    label,
    htmlFor,
    ...inputProps
}: {
    label: ReactNode;
    htmlFor: string;
} & InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={htmlFor}>{label}</Label>
            <Input id={htmlFor} {...inputProps} />
        </div>
    );
};

const Label = ({
    children,
    htmlFor,
    className,
}: {
    children: ReactNode;
    htmlFor: string;
    className?: string;
}) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`after:ml-0.5 after:text-red-500 after:content-['*'] ${className ?? ""}`}
        >
            {children}
        </label>
    );
};

const Input = ({
    type = "text",
    className,
    ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <input
            type={type}
            {...props}
            className={`rounded-lg bg-gray-100 p-2 shadow-sm transition-all duration-200 placeholder:text-neutral-300 focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2 focus:outline-none ${className ?? ""} `}
        />
    );
};
