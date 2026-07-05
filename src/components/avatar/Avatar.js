import './avatar.css';

const avatarColors = [
  '#F94144',
  '#F3722C',
  '#F8961E',
  '#F9C74F',
  '#90BE6D',
  '#43AA8B',
  '#577590',
  '#277DA1',
];

function getAvatarColor(name) {
  if (!name) return avatarColors[0];
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
}

function Avatar({ name, size = 34, fontSize = 15, className = '' }) {
  const letter = name?.charAt(0).toUpperCase() || '?';

  return (
    <div
      className={`avatar-letter ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: fontSize,
        backgroundColor: getAvatarColor(name),
      }}
    >
      {letter}
    </div>
  );
}

export default Avatar;