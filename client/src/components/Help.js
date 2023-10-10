export default function Help({ ni }) {

    const deltax = Math.floor(window.innerWidth / 2 - (ni * 32) / 2);
    const style = {
      left: deltax,
      top: 480,
      width: ni * 32
    };
  
    return ni > 11 ? <div className="help" style={style} >use keyboard arrows to move your player and spacebar to drop a bomb</div>
        : <></>;
  }