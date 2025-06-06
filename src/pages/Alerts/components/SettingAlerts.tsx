import { fetchSettingsAlert } from '@/apis/alerts.api';
import Modal from '@/components/common/modal';
import N3Switch from '@/components/common/switch/N3Switch';
import Text from '@/components/common/text';
import useUserStore from '@/stores/user.store';
import { useEffect, useMemo, useState, startTransition } from 'react';
import { AlertSettings } from '@/type/auth.type';
interface SettingAlertsProps {
    visible: boolean;
    onClose: () => void;
}
const SettingAlerts = ({ visible, onClose }: SettingAlertsProps) => {
    const alertSettings = useUserStore((state) => state.userSettings.alert);
    const [settings, setSetings] = useState<AlertSettings>({
        ...alertSettings
    });

    useEffect(() => {
        setSetings({ ...alertSettings });
    }, [visible]);

    const configs = useMemo(() => {
        return [{ label: 'Enable alerts via app', key: 'TELEGRAM', value: settings.TELEGRAM }];
    }, [settings]);

    const onChange = (key: string, value: boolean) => {
        setSetings({ ...settings, [key]: !value });
        startTransition(() => {
            fetchSettingsAlert('put', { [key]: !value }).then((data) => {
                if (data?.status === 'ok') {
                    useUserStore.setState((state) => ({
                        userSettings: {
                            ...state.userSettings,
                            alert: { ...alertSettings, [key]: !value }
                        }
                    }));
                }
            });
        });
    };

    return (
        <Modal title="ALERT SETTING" visible={visible} onClose={onClose}>
            <div className="flex flex-col space-y-3">
                {configs.map((config) => (
                    <div key={config.key} className="flex justify-between items-center h-7">
                        <Text>{config.label}</Text>
                        <N3Switch active={config.value} onClick={() => onChange(config.key, config.value)} />
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export default SettingAlerts;
