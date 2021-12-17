printDone() {
  echo -e '\e[1;32mdone\e[0m'
}

write() {
  printf "Generating \e[1;33m$1.test.ts\e[0m ... "

  declare -a names
  declare -a importNames

  for file in ./$1/*.ts; do
    name=$(basename $file .ts)

    if [ $name != "index" ]; then
      folder="./tests/$1"
      filename="$folder/$name.test.ts"

      rm -f $filename
      mkdir -p $folder
      
      importName="_${name//\./}"

      names+=($name)
      importNames+=($importName)

      echo "import suite from '~/tests/helpers/suite'" >> $filename
      echo "import extra from '~/tests/helpers/testExpression';" >> $filename
      echo "import * as file from '~/$1/$name'" >> $filename
      echo "" >> $filename
      echo "suite({ section: '$1', name: '$name', file, extra });" >> $filename
    fi
  done

  printDone
}

write 'builtins' 'testExpression'
write 'dom' 'testExpression'
write 'localization' 'testExpression'
# write 'syntax' 'testEntry'




