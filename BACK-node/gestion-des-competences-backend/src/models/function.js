module.exports = (sequelize, DataTypes) => {
    const Function = sequelize.define(
        'Function',
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
    Function.associate = models =>{
        Function.belongsTo(models.Department,{
            foreignKey: {
                allowNull: false,
            },
        });
       Function.hasMany(models.User);
       Function.belongsToMany(models.Skill, { through: models.FunctionSkill });
    }
    return Function;
}
