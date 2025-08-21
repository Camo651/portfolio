import { DataTypes, Model } from 'sequelize';
import { sequelize } from './dbHelper';

export interface TrackerModelType {
    id: string;
    machineId?: string;
    sessionId?: string;
    action?: string;
    ip?: string;
    userAgent?: string;
    createdAt?: string;
}
class TrackerModel extends Model {}
TrackerModel.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        machineId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sessionId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        action: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userAgent: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    { sequelize }
);

export const track = async (data: Partial<TrackerModelType>) => {
    await TrackerModel.create({
        id: crypto.randomUUID(),
        machineId: data.machineId ?? null,
        sessionId: data.sessionId ?? null,
        action: data.action ?? null,
        ip: data.ip ?? null,
        userAgent: data.userAgent ?? null,
    });
};
