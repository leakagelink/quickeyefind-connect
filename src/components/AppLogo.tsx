import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import defaultLogo from "@/assets/quikeye-logo.png.asset.json";
import { getBranding } from "@/lib/branding.functions";

/** Live app logo — admin-uploaded logo when set, bundled logo otherwise. */
export function useAppLogo() {
  const fetchBranding = useServerFn(getBranding);
  const { data } = useQuery({
    queryKey: ["branding"],
    queryFn: fetchBranding,
    staleTime: 5 * 60_000,
  });
  return data?.logoUrl ?? defaultLogo.url;
}

type Props = {
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

export function AppLogo({ className, alt = "Quike Eye logo", width, height, priority }: Props) {
  const src = useAppLogo();
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      decoding="async"
      {...(priority ? { fetchPriority: "high" as const } : {})}
    />
  );
}
