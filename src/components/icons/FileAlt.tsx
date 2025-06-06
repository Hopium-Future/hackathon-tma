import { BaseIcon, IconProps } from ".";

const FileAltIcon = ({ ...props }: IconProps) => {
  return (
    <BaseIcon {...props} viewBox="0 0 16 16" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 14.667H2V1.334h8v1.333h1.333V4h1.334v1.334H14v9.333zM11.333 4H10v1.334h1.333V4zm-8-1.333v10.667h9.334V6.667h-4v-4H3.333zm5.334 8h-4V12h4v-1.333zM4.667 8h6.666v1.334H4.667V8zm2.666-2.666H4.667v1.333h2.666V5.334z"
        fill="#3BD975"
      />
    </BaseIcon>
  );
};

export default FileAltIcon;
