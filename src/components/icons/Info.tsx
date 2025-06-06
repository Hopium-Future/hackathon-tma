import { BaseIcon, IconProps } from ".";

const InfoIcon = ({ ...props }: IconProps) => {
  return (
    <BaseIcon {...props} viewBox="0 0 12 12" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.5 1.5h-5v1h-1v1h-1v5h1v1h1v-1h-1v-5h1v-1h5v1h1v-1h-1v-1zm0 8h-5v1h5v-1zm1-6h1v5h-1v-5zm0 5h-1v1h1v-1z"
        fill="#9D9D9D"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 5h-1v3.5h1V5z"
        fill="#9D9D9D"
      />
      <path fill="#9D9D9D" d="M5.5 3.5H6.5V4.5H5.5z" />
    </BaseIcon>
  );
};

export default InfoIcon;
