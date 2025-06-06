import { BaseIcon, IconProps } from '.'

const SyncIcon = ({ ...props }: IconProps) => {
  return (
    <BaseIcon
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.5 8.83301L2.5 7.16634L17.5 7.16634L17.5 8.83301L2.5 8.83301ZM17.5 13.833L17.5 12.1663L2.5 12.1663L2.5 13.833L4.16666 13.833L4.16666 15.4997L5.83333 15.4997L5.83333 13.833L17.5 13.833ZM7.5 15.4997L7.5 17.1663L5.83333 17.1663L5.83333 15.4997L7.5 15.4997ZM14.1667 5.49967L14.1667 7.16634L15.8333 7.16634L15.8333 5.49967L14.1667 5.49967ZM12.5 5.49967L12.5 3.83301L14.1667 3.83301L14.1667 5.49967L12.5 5.49967Z"
        fill={props.color || '#F6F6F6'}
      />
    </BaseIcon>
  )
}

export default SyncIcon
