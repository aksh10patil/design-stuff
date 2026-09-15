import Derivative from "@/public/components_v5/Derivative";
import apple from "@/public/site_image/apple.png";
import grokBot from "@/public/site_image/grok-bot.png";
import key from "@/public/site_image/key.png";
import oxAlpha from "@/public/site_image/ox-alpha.png";
import posthog from "@/public/site_image/posthog.png";
import shad from "@/public/site_image/shad.png";
import tesla from "@/public/site_image/tesla.png";
import vo from "@/public/site_image/vo.png";
import xbo from "@/public/site_image/xbo.png";
import Image, { type StaticImageData } from "next/image";

type CardProps = {
    image: StaticImageData;
    title: string;
    alt: string;
    imageClassName?: string;
    className?: string;
};

const Card = ({
    image,
    title,
    alt,
    imageClassName = "h-[220px]",
    className = "",
}: CardProps) => {
    return (
        <div
            className={`group mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-1 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md ${className}`}
        >
            <div className={`relative w-full overflow-hidden rounded-xl bg-neutral-100 ${imageClassName}`}>
                <Image
                    src={image}
                    alt={alt}
                    height={500}
                    width={500}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
            </div>
        </div>
    );
};

export default function Playground() {
    return (
        <div className="bg-white px-8 pb-20">
            <Derivative />

            <div className="mx-auto max-w-7xl columns-1 border-2 border-neutral-200 rounded-2xl mask-b-from-90% p-2 gap-2 md:columns-2 xl:columns-4">
                <Card
                    image={apple}
                    title="Apple"
                    alt="Apple site preview"
                    imageClassName="h-[260px]"
                />
                <Card
                    image={grokBot}
                    title="Grok Bot"
                    alt="Grok bot site preview"
                    imageClassName="h-[260px]"
                />
                <Card
                    image={key}
                    title="Key"
                    alt="Key site preview"
                    imageClassName="h-[220px]"
                />
                <Card
                    image={oxAlpha}
                    title="Ox Alpha"
                    alt="Ox Alpha site preview"
                    imageClassName="h-[220px]"
                />
                <Card
                    image={posthog}
                    title="PostHog"
                    alt="PostHog site preview"
                    imageClassName="h-[260px]"
                />
                <Card
                    image={shad}
                    title="Shad"
                    alt="Shad site preview"
                    imageClassName="h-[260px]"
                />
                <Card
                    image={tesla}
                    title="Tesla"
                    alt="Tesla site preview"
                    imageClassName="h-[220px]"
                />
                <Card
                    image={vo}
                    title="Vo"
                    alt="Vo site preview"
                    imageClassName="h-[220px]"
                />
                <Card
                    image={xbo}
                    title="Xbo"
                    alt="Xbo site preview"
                    imageClassName="h-[220px]"
                />
                <Card
                    image={grokBot}
                    title="Grok Bot"
                    alt="Grok bot site preview"
                    imageClassName="h-[260px]"
                />
                <Card
                    image={key}
                    title="Key"
                    alt="Key site preview"
                    imageClassName="h-[220px]"
                />
                <Card
                    image={oxAlpha}
                    title="Ox Alpha"
                    alt="Ox Alpha site preview"
                    imageClassName="h-[220px]"
                />
            </div>
        </div>
    );
}
