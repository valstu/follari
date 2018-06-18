# follari

> Availability of Föli bicycles in Turku

Check out live version [here](https://follari.kans.io/)

## Development

This app has been bootstrapped with Create React App; the CRA readme
lives [here][cra-readme].

### Configuration

You'll need a Google Maps API key.

- Copy `.env.template` to `.env`; fill in the Google Maps API key.

### Day-to-day development

- Use `npm start` (or `yarn start`) to start the development server.
- Use `npm run build` (or `yarn build`) to build a production version.

## Publish to now.sh

If you want to publish this project on now.sh follow these steps.

- Make sure you've [now-cli](https://github.com/zeit/now-cli) installed (if not install it with `npm install -g now`)
- Create `now.json` file to project root with content something like this

```json
{
  "name": "project-name-here",
  "dotenv": ".env"
}
```

- Publish your project with command `now`, that's it!

## Contributors

Thanks to all the people who [contribute][contributors].

## License

MIT

[contributors]: https://github.com/valstu/follari/graphs/contributors
[cra-readme]: https://github.com/facebook/create-react-app/blob/dfbc71ce2ae07547a8544cce14a1a23fac99e071/packages/react-scripts/template/README.md
