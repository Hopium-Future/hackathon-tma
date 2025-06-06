import DOMPurify from 'dompurify';
import { FC } from "react";

type RulesProps = {
  data: string;
};
const Rules: FC<RulesProps> = ({ data }) => {
  const sanitizedData = () => ({
    __html: DOMPurify.sanitize(data)
  });
  return (
    <div
      className="px-3"
      dangerouslySetInnerHTML={sanitizedData()}
    />
  );
};

export default Rules;