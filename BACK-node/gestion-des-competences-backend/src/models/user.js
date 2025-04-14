module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id : {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            company: {
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
    User.associate = models =>{
        User.belongsTo(models.Department,{
            foreignKey: {
                allowNull: false,
            },
        });
        User.belongsTo(models.Function,{
            foreignKey: {
                allowNull: false,
            },
        });
        User.belongsTo(models.Role,{
            foreignKey: {
                allowNull: false,
            },
        })
        User.hasMany(models.SkillEvaluation,{
            foreignKey : 'evaluatorId',
            as : 'skillEvaluationDone' ,
        })
        User.hasMany(models.SkillEvaluation,{
            foreignKey : "forUser" ,
            as : 'OwnSkillEvaluation',
            onDelete: 'CASCADE'
        })

    }
    return User;
}

