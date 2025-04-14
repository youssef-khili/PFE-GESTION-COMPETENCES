module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define(
        'Role',
        {
            id : {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
            },
            enabled : {
                type : DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false,

            },
        },
        {
            freezeTableName: true,
        }
    );
    Role.associate = models =>{
        Role.hasMany(models.User)
    }
    return Role;
}
