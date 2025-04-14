module.exports = (sequelize, DataTypes) => {
    const SkillEvaluation = sequelize.define(
        'SkillEvaluation',
        {
            id : {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            level: {
                type: DataTypes.REAL,
                allowNull: false,
                defaultValue:0
            },
            evaluationEvidence: {
                type: DataTypes.STRING,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue:'Not Evaluated'
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
    SkillEvaluation.associate = models => {
        SkillEvaluation.belongsTo(models.Skill, {
            foreignKey: {
                allowNull: false,
                name: 'skillId'
            },
        });
        SkillEvaluation.belongsTo(models.User, {
            foreignKey: {
                allowNull: true,
                name:'evaluatorId',
            },
            as :'evaluator'
        })
        SkillEvaluation.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                name:'forUser',
            },
            onDelete: 'CASCADE',
        });
    }

    return SkillEvaluation;
}
