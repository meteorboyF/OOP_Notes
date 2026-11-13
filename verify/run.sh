#!/usr/bin/env bash
# Compiles and runs every verification program in verify/q*/ and writes what Java printed
# to <dir>/expected.txt. If <dir>/input.txt exists it is fed to stdin (for Scanner programs).
# check-traces.js then compares those files with the answers shown on the site.
cd "$(dirname "$0")"
here=$(pwd)
out=${TMPDIR:-/tmp}/oopv
status=0
for d in q*/ p_*/; do
  d=${d%/}
  main=$(grep -l "static void main" "$d"/*.java | head -1)
  cls=$(basename "$main" .java)
  rm -rf "$out/$d"; mkdir -p "$out/$d"
  input=/dev/null
  [ -f "$here/$d/input.txt" ] && input="$here/$d/input.txt"
  if javac -d "$out/$d" "$d"/*.java 2>"$out/$d.err"; then
    (cd "$out/$d" && timeout 5 java "$cls" < "$input") > "$d/expected.txt" 2>&1
  else
    echo "COMPILE ERROR in $d"; cat "$out/$d.err"; status=1
  fi
done
echo done
exit $status
