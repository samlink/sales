#!/bin/bash

terser ./parts/alert.mjs -c -o ../min/parts/alert.mjs
terser ./parts/autocomplete.mjs -c -o ../min/parts/autocomplete.mjs
terser ./parts/notifier.mjs -c -o ../min/parts/notifier.mjs
terser ./parts/service.mjs -c -o ../min/parts/service.mjs
terser ./parts/table.mjs -c -o ../min/parts/table.mjs
terser ./parts/table_class.mjs -c -o ../min/parts/table_class.mjs
terser ./parts/tools.mjs -c -o ../min/parts/tools.mjs
terser ./parts/tree.mjs -c -o ../min/parts/tree.mjs

