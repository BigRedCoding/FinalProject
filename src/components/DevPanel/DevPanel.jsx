import "./DevPanel.css";

export default function DevPanel({
  devVisible,
  setDevVisible,
  button1Function,
  button2Function,
  button3Function,
  button4Function,
  button5Function,
}) {
  const devExit = () => {
    setDevVisible("isHidden");
  };

  return (
    <div className={`devPanel ${devVisible}`}>
      <button className="devPanel__exit-button" onClick={devExit}>
        X
      </button>
      <div className="devPanel__test-buttons">
        <button className="devPanel__button" onClick={button1Function}>
          <p className="devPanel__button-text">Button 1</p>
        </button>
        <button className="devPanel__button" onClick={button2Function}>
          <p className="devPanel__button-text">Button 2</p>
        </button>
        <button className="devPanel__button" onClick={button3Function}>
          <p className="devPanel__button-text">Button 3</p>
        </button>
        <button className="devPanel__button" onClick={button4Function}>
          <p className="devPanel__button-text">Button 4</p>
        </button>
        <button className="devPanel__button" onClick={button5Function}>
          <p className="devPanel__button-text">Button 5</p>
        </button>
      </div>
    </div>
  );
}
