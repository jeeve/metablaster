export default function Score({ n, name, displayName }) {
  let text = n;

  return (
    <>
      {displayName ? <span className="playername">{name}</span> : <></>}
      <span className="scorevalue">{text}</span>
    </>
  );
}
