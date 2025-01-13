#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { UnoApiStack } from '../lib/unoApiStack';
import { UnoLambdaStack } from '../lib/unoLambdaStack';
import { UnoDatabaseStack } from '../lib/unoDatabase.Stack';
import { UnoAuthStack } from '../lib/unoAuthStack';

const app = new cdk.App();

const auth = new UnoAuthStack(app, "unoAuthStack", {
    stackName: "UnoAuthStack"
})

const database = new UnoDatabaseStack(app, "unoDatabaseStack", {
    stackName: "UnoDatabaseStack"
})

const lambdas = new UnoLambdaStack(app, "UnoLambdaStack", {
    stackName: "UnoLamdbaStack"
});

const api = new UnoApiStack(app, "UnoApiStack", 
    {
        getPokemonLambda: lambdas.getPokemonLambda,
        postPokemonLambda: lambdas.postPokemonLambda,
        getOnePokemonLambda: lambdas.getOnePokemonLamdba,
        updatePokemonLambda: lambdas.updatePokemonLamdba,
        deletePokemonLambda: lambdas.deletePokemonLamdba
    }, {
        registerLambda: auth.registerLambda,
        loginLambda: auth.loginLambda,
        userPool: auth.userPool
    }, {
    stackName: "UnoApiStack"
});

