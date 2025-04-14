
module.exports = (sequelize, DataTypes) => {
    const FunctionSkill = sequelize.define('FunctionSkill', {
        FunctionId : {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            references: {
                model: 'Function',
                key: 'id'
            }
        },
        SkillId : {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            references: {
                model: 'Skill',
                key: 'id'
            }
        },

    })
    return FunctionSkill;
};
