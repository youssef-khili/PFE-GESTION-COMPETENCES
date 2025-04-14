module.exports = (sequelize, DataTypes) => {
    const Department = sequelize.define(
        'Department',
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
    Department.associate = models =>{
     Department.hasMany(models.User);
     Department.hasMany(models.Function);
    }
    return Department;
}
