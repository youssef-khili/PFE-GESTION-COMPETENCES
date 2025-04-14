module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define(
        'Category',
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
    Category.associate = models =>{
        Category.hasMany(models.Skill,{foreignKey: "categoryId"})
    }

    return Category;
}
