printDone() {
  echo -e '\e[1;32mdone\e[0m'
}

write() {
  printf "Generating \e[1;33m$1\e[0m/index.ts ... "

  declare -a names
  declare -a importNames
  filename="./$1/index.ts"

  rm -f $filename

  for file in ./$1/*.ts; do
    name=$(basename $file .ts)
    importName="_${name//\./}"

    names+=($name)
    importNames+=($importName)

    echo "import $importName from './$name';" >> $filename
  done

  echo "" >> $filename
  echo "export default () => ({" >> $filename

  COUNT=${#names[@]}

  for ((i=0; i<$COUNT; i++)); do
    key=${names[$i]}
    import=${importNames[$i]}
   
    echo "  '$key': $import()," >> $filename
  done

  echo "});" >> $filename

  printDone
}

mainIndex() {
  printf "Generating \e[1;33mmain index.ts\e[0m ... "

  declare -a names
  filename="./index.ts"

  rm -f $filename

  for file in ./es20[1-2][0-9].ts; do
    name=$(basename $file .ts)
    names+=($name)
    
    echo "import $name from './$name';" >> $filename
  done

  echo "" >> $filename
  echo "export default () => ({" >> $filename

  for name in ${names[@]}; do
    echo "  $name: $name()," >> $filename
  done

  echo "});" >> $filename

  printDone
}

write 'builtins'
write 'dom'
write 'localization'
write "syntax"
mainIndex




