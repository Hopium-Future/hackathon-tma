import { setFuturesLeverage } from '@/apis/futures.api';
import Button from '@/components/common/Button';
import Card from '@/components/common/card';
import Modal from '@/components/common/modal';
import SliderRanger from '@/components/common/slider';
import { PairConfig } from '@/type/futures.type';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface LeverageSettingProps {
    leverage: number;
    setLeverage: (value: number) => void;
    pairConfig: PairConfig;
}
const LeverageSetting = ({ leverage, setLeverage, pairConfig }: LeverageSettingProps) => {
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const onConfirm = async (e: number) => {
        await setFuturesLeverage(pairConfig.symbol, e);
        setLeverage(e);
        toggleModal();
    };
    return (
        <>
            <LeverageSettingModal visible={showModal} onClose={toggleModal} leverage={leverage} max={pairConfig.leverageConfig.max} onConfirm={onConfirm} />
            <Card className="bg-background-4 flex flex-col justify-center items-center min-w-12" onClick={toggleModal}>
                <div className="font-bold text-md">{leverage}x</div>
            </Card>
        </>
    );
};

interface LeverageSettingModalProps {
    visible: boolean;
    onClose: () => void;
    leverage: number;
    max: number;
    onConfirm: (e: number) => void;
}
const LeverageSettingModal = ({ visible, onClose, leverage, max, onConfirm }: LeverageSettingModalProps) => {
    const [value, setValue] = useState(leverage);

    useEffect(() => {
        setValue(leverage);
    }, [leverage, visible]);

    const marks = useMemo(() => {
        const step = max / 5;
        return {
            0: '0x',
            [step]: `${step}x`,
            [step * 2]: `${step * 2}x`,
            [step * 3]: `${step * 3}x`,
            [step * 4]: `${step * 4}x`,
            [max]: `${max}x`
        };
    }, [max]);

    const onChangeLeverage = useCallback(
        (value: any) => {
            setValue(value || 1);
        },
        [value]
    );

    return (
        <Modal title="ADJUST LEVERAGE" visible={visible} onClose={onClose}>
            <h1 className="text-4xl font-bold text-green-1 flex items-center justify-center w-full pb-3">{value}x</h1>
            <SliderRanger className="mt-3" positionLabel="bottom" value={value} marks={marks} min={0} max={max} onChange={onChangeLeverage} />
            <Button variant="primary" className="font-bold mt-6 h-10 uppercase" disabled={!value} onClick={() => onConfirm(value)}>
                Confirm
            </Button>
        </Modal>
    );
};

export default LeverageSetting;
