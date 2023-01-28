#!/bin/zsh
cp README.md package
cp CHANGELOG.md package
npm run build
cd package
echo "请选择要升级的版本号："
select command in major minor patch quit; do
    case $command in

    major)
        version_name="major"
        break
        ;;

    minor)
        version_name="minor"
        break
        ;;

    patch)
        version_name="patch"
        break
        ;;

    quit)
        exit
        ;;

    *)
        echo "请输入数字1-4"
        ;;
    esac
done

echo "--------------------开始发布--------------------"

# 更新版本号
new_version=`npm version $version_name`

# 推送 npm 仓库
npm publish --registry=https://registry.npmjs.org

if [ $? == 0 ]; then
    echo "\033[1;32m发布成功: $new_version"
else
    echo "\033[1;31m发布失败"
fi

echo "\033[0m--------------------npm 推送完成--------------------"

# 回到外层目录
cd ../

git add .
git commit -m "auto commit@$new_version"

# 更新版本号,会自动打tag
npm version $version_name


# git push
# git push origin $new_version
# git push origin --tags