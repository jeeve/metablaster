import * as init from "../init";

export default function Sprite({ x, y, image }) {
  const deltax = Math.floor(window.innerWidth / 2 - (init.ni * 32) / 2);
  const style = {
    left: deltax + x,
    top: y,
  };

  return <img style={style} src={"/images/" + image} alt="" />;
}
