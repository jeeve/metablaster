export default function Score({ n, name, displayName }) {
  let text = "";
  if (n > -1) {
    text = n;
  }
  return (
    <>
      <span className="scorevalue">{text}</span>
      {displayName ? <span className="playername">{name}</span> : <></>}
    </>
  );
}
