((js-mode . ((js-indent-level . 2)
             (eval . (let ((project-directory (car (dir-locals-find-file default-directory))))
                       (make-local-variable 'flycheck-javascript-eslint-executable)
                       (setq flycheck-javascript-eslint-executable (concat project-directory ".yarn/sdks/eslint/bin/eslint.js")))))))
