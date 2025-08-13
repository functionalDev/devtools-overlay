import * as theme  from './packages/shared/src/theme.ts'
import * as unocss from '@unocss/core'
import presetUno   from '@unocss/preset-uno'

const uno_config: unocss.UserConfig = {
    
    presets: [presetUno({ dark: 'media' })],
    theme: {
        colors: theme.colors,

        spacing: theme.spacing,
        height: theme.spacing,
        minHeight: theme.spacing,
        maxHeight: theme.spacing,
        lineHeight: theme.spacing,
        width: theme.spacing,
        minWidth: theme.spacing,
        maxWidth: theme.spacing,

        fontFamily: theme.font,
        fontSize: theme.fontSize,
    },
    variants: [
        matcher => {
            const key = 'selected'
            if (!matcher.startsWith(key + ':')) return matcher
            return {
                matcher: matcher.slice(key.length + 1),
                selector: s => s + '[aria-selected=true]',
            }
        },
    ],
    rules: [],
    shortcuts: {
        'center-child': 'flex items-center justify-center',
    },
}

export default uno_config

/* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
*/
