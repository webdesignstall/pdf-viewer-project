import PrimaryLayout from "@/components/shared/primaryLayout";

type Props = {
  children: React.ReactNode;
};

export default async function PublicLayout({ children }: Props) {
  return <PrimaryLayout>{children}</PrimaryLayout>;
}
