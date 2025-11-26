import ReactLoading from "react-loading";

type LoadingType =
  | "balls"
  | "bars"
  | "bubbles"
  | "cubes"
  | "cylon"
  | "spin"
  | "spinningBubbles"
  | "spokes";

export default function Loading({ typeLoad }: { typeLoad: LoadingType }) {
  return <ReactLoading type={typeLoad} />;
}
