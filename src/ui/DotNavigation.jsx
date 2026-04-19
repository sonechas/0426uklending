

const DotNavigation = ({ targetIds }) => {
  return (
    <ul className="dots-wrapper">
      {targetIds.map((id, index) => (
        <li key={index} className="dot">
          <a href={`#${id}`} className="dot-link">
          </a>
        </li>
      ))}
    </ul>
  );
};

export default DotNavigation;
