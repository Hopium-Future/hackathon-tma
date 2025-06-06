import { useMemo, useState } from 'react';
import Chip from '../chip';
import Modal from '.';

interface SelectModalProps {
    value: string | null;
    options: { title: string; value: string | number | null }[];
    title: string;
    cols: number;
    onChange: (value: string | number | null) => void;
}
const SelectModal = ({ value, onChange, options, title, cols }: SelectModalProps) => {
    const [showModal, setShowModal] = useState(false);

    const item = useMemo(() => {
        return options.find((e) => e.value === value);
    }, [value]);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const onConfirm = (e: string | number | null) => {
        onChange(e);
        toggleModal();
    };
    return (
        <>
            <Chip active className="flex items-center space-x-1 px-3 py-[6px] text-sm font-bold !text-main" onClick={toggleModal}>
                <span>{title}:</span>
                <span>{item?.title}</span>
            </Chip>
            <Modal title={title} visible={showModal} onClose={toggleModal}>
                <div className={`grid grid-cols-${cols} gap-2`}>
                    {options.map((e) => (
                        <Chip key={e.value} background="2" onClick={() => onConfirm(e.value)} active={item?.value === e.value}>
                            {e.title}
                        </Chip>
                    ))}
                </div>
            </Modal>
        </>
    );
};

export default SelectModal;
