export default function Controls({ onDisplacement, onBomb }) {
  return (
    <div id="controles">
      <button
        type="button"
        className="controle"
        id="bouton-haut"
        onMouseDown={() => onDisplacement("up")}
        onMouseUp={() => onDisplacement( "")}
        onTouchStart={() => onDisplacement("up")}
        onTouchEnd={() => onDisplacement("")}
      >
        ↑
      </button>
      <div>
        <button
          type="button"
          className="controle"
          id="bouton-gauche"
          onMouseDown={() => onDisplacement("left")}
          onMouseUp={() => onDisplacement("")}
          onTouchStart={() => onDisplacement("left")}
          onTouchEnd={() => onDisplacement("")}
        >
          ←
        </button>
        <button
          type="button"
          className="controle"
          id="bouton-bombe"
          onClick={() => {
            onBomb();
          }}
        >
          bomb
        </button>
        <button
          type="button"
          className="controle"
          id="bouton-droite"
          onMouseDown={() => onDisplacement("right")}
          onMouseUp={() => onDisplacement("")}
          onTouchStart={() => onDisplacement("right")}
          onTouchEnd={() => onDisplacement("")}
        >
          →
        </button>
      </div>
      <button
        type="button"
        className="controle"
        id="bouton-bas"
        onMouseDown={() => onDisplacement("down")}
        onMouseUp={() => onDisplacement("")}
        onTouchStart={() => onDisplacement("down")}
        onTouchEnd={() => onDisplacement("")}
      >
        ↓
      </button>
    </div>
  );
}
