import type {WebpackOverrideFn} from '@remotion/bundler';

export const webpackOverride: WebpackOverrideFn = (currentConfiguration) => {
  return {
    ...currentConfiguration,
    module: {
      ...currentConfiguration.module,
      rules: [
        ...(currentConfiguration.module?.rules ?? []),
        {
          test: /\.css$/i,
          // use: ['style-loader', 'css-loader', 'postcss-loader'],
          use: [ 'postcss-loader'],
        },
      ],
    },
  };
};
